const Asset = require('../models/Asset');
const QRCode = require('qrcode');

/**
 * @desc    Obtener todos los activos
 * @route   GET /api/assets
 * @access  Privado
 */
exports.getAllAssets = async (req, res) => {
  try {
    // Paginación
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Búsqueda y filtrado
    const query = {};
    if (req.query.type) query.type = req.query.type;
    if (req.query.status) query.status = req.query.status;

    const [assets, total] = await Promise.all([
      Asset.find(query)
        .skip(skip)
        .limit(limit)
        .select('-__v')
        .sort({ createdAt: -1 }),
      Asset.countDocuments(query)
    ]);

    res.json({
      success: true,
      count: assets.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: assets
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los activos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Crear nuevo activo con QR
 * @route   POST /api/assets
 * @access  Privado (Admin)
 */
exports.createAssetWithQR = async (req, res) => {
  try {
    const { assetNumber, type, model, specifications } = req.body;

    // Validación mejorada
    const missingFields = [];
    if (!assetNumber) missingFields.push('assetNumber');
    if (!type) missingFields.push('type');
    if (!model) missingFields.push('model');

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Campos requeridos faltantes',
        missingFields,
        example: {
          assetNumber: "IT-001",
          type: "Laptop",
          model: "Dell XPS 15",
          specifications: {
            brand: "Dell",
            serialNumber: "ABC123XYZ"
          }
        }
      });
    }

    // Generar QR con metadata
    const qrData = {
      assetId: assetNumber.toUpperCase(),
      apiEndpoint: `${process.env.API_BASE_URL}/api/assets/${assetNumber}`,
      timestamp: new Date().toISOString()
    };

    const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));

    // Crear documento
    const asset = new Asset({
      assetNumber: assetNumber.toUpperCase(),
      type,
      model,
      qrCode,
      specifications: {
        ...specifications,
        addedBy: req.user.userId // ID del usuario que crea el activo
      },
      status: 'Activo'
    });

    await asset.save();

    // Formatear respuesta
    const response = asset.toObject();
    delete response.__v;

    res.status(201).json({
      success: true,
      message: 'Activo creado exitosamente',
      data: response,
      qrCode, // Opcional: incluir QR en respuesta
      links: {
        view: `/api/assets/${response.assetNumber}`,
        qrImage: `/api/assets/${response.assetNumber}/qr`,
        allAssets: '/api/assets'
      }
    });

  } catch (error) {
    // Manejo específico de errores de duplicado
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'El número de activo ya existe',
        action: 'Intente con un número diferente'
      });
    }

    // Otros errores
    res.status(500).json({
      success: false,
      message: 'Error al crear el activo',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * @desc    Obtener activo por número
 * @route   GET /api/assets/:assetNumber
 * @access  Privado
 */
exports.getAssetByNumber = async (req, res) => {
  try {
    const asset = await Asset.findOne(
      { assetNumber: req.params.assetNumber.toUpperCase() },
      '-__v -maintenance._id' // Excluir campos
    );

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Activo no encontrado',
        searchedValue: req.params.assetNumber
      });
    }

    res.json({
      success: true,
      data: asset,
      links: {
        qrCode: `/api/assets/${asset.assetNumber}/qr`,
        allAssets: '/api/assets'
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al buscar el activo',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Obtener imagen QR de un activo
 * @route   GET /api/assets/:assetNumber/qr
 * @access  Privado
 */
exports.getAssetQR = async (req, res) => {
  try {
    const asset = await Asset.findOne(
      { assetNumber: req.params.assetNumber.toUpperCase() },
      'qrCode'
    );

    if (!asset || !asset.qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR no encontrado para el activo especificado'
      });
    }

    // Extraer base64 del Data URL
    const base64Data = asset.qrCode.replace(/^data:image\/png;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Configurar headers y enviar imagen
    res.set({
      'Content-Type': 'image/png',
      'Content-Length': imageBuffer.length,
      'Cache-Control': 'public, max-age=86400' // Cache de 24 horas
    });

    res.end(imageBuffer);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al generar el código QR',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Agregar registro de mantenimiento
 * @route   POST /api/assets/:assetNumber/maintenance
 * @access  Privado (Técnicos)
 */
exports.addMaintenanceRecord = async (req, res) => {
  try {
    const { description, technician, cost } = req.body;

    const asset = await Asset.findOneAndUpdate(
      { assetNumber: req.params.assetNumber.toUpperCase() },
      {
        $push: {
          maintenance: {
            description,
            technician,
            cost: parseFloat(cost) || 0,
            performedBy: req.user.userId
          }
        },
        $set: { status: 'En mantenimiento' }
      },
      { new: true, select: '-__v' }
    );

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Activo no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Registro de mantenimiento añadido',
      data: asset.maintenance[asset.maintenance.length - 1], // Último registro
      assetStatus: asset.status
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al agregar mantenimiento',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};