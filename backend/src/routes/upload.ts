import { Router, Request, Response } from 'express';
import multer from 'multer';
import { validateUploadFile, UPLOADTHING_CONFIG } from '../uploadthing/router.js';
import { authenticate } from '../middleware/auth.js';

const router: Router = Router();

// Memory storage for multer so we can stream/upload or save as base64/buffer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 64 * 1024 * 1024, // 64 MB max
  },
});

/**
 * POST /api/upload/image
 * Handles image uploads for products with type/size validation
 */
router.post(
  '/image',
  authenticate,
  upload.single('file'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, error: 'No image file uploaded' });
        return;
      }

      const validation = validateUploadFile(req.file, 'image');
      if (!validation.valid) {
        res.status(400).json({ success: false, error: validation.error });
        return;
      }

      // Convert image to a data URL for lightweight storage/instant preview
      const base64Data = req.file.buffer.toString('base64');
      const dataUrl = `data:${req.file.mimetype};base64,${base64Data}`;

      res.json({
        success: true,
        data: {
          fileKey: `img_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          fileName: req.file.originalname,
          fileUrl: dataUrl,
          fileSize: req.file.size,
          mimeType: req.file.mimetype,
        },
      });
    } catch (err: any) {
      console.error('[Upload] Image upload error:', err);
      res.status(500).json({ success: false, error: err.message || 'Upload processing failed' });
    }
  }
);

/**
 * POST /api/upload/cad
 * Handles CAD file uploads (STL, STEP, STP, OBJ, 3MF) for custom 3D printing
 */
router.post(
  '/cad',
  upload.single('file'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, error: 'No CAD file uploaded' });
        return;
      }

      const validation = validateUploadFile(req.file, 'cad');
      if (!validation.valid) {
        res.status(400).json({ success: false, error: validation.error });
        return;
      }

      res.json({
        success: true,
        data: {
          fileKey: `cad_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          fileName: req.file.originalname,
          fileSize: req.file.size,
          mimeType: req.file.mimetype,
          status: 'verified',
        },
      });
    } catch (err: any) {
      console.error('[Upload] CAD upload error:', err);
      res.status(500).json({ success: false, error: err.message || 'CAD processing failed' });
    }
  }
);

export default router;
