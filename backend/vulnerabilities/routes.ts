import { Router, type Request, type Response } from 'express';
import { vulnerabilities } from './index.js';
import type { VulnerabilityListItem } from './types.js';

const router = Router();

/**
 * GET /api/vulnerabilities
 * Lista todas las vulnerabilidades del OWASP Top 10
 */
router.get('/', (_req: Request, res: Response) => {
  try {
    const vulnerabilitiesList: VulnerabilityListItem[] = vulnerabilities.map((vuln) => ({
      id: vuln.id,
      code: vuln.code,
      title: vuln.title,
      shortTitle: vuln.shortTitle,
      icon: vuln.icon,
      rank: vuln.overview.rank,
      incidenceRate: vuln.overview.incidenceRate,
      description: vuln.overview.description,
    }));

    res.json({
      success: true,
      data: vulnerabilitiesList,
      total: vulnerabilitiesList.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener las vulnerabilidades',
    });
  }
});

/**
 * GET /api/vulnerabilities/:id
 * Obtiene los detalles completos de una vulnerabilidad específica
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vulnerability = vulnerabilities.find(
      (v) => v.id === id.toUpperCase() || v.shortTitle === id.toLowerCase()
    );

    if (!vulnerability) {
      return res.status(404).json({
        success: false,
        error: `Vulnerabilidad '${id}' no encontrada`,
      });
    }

    res.json({
      success: true,
      data: vulnerability,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener la vulnerabilidad',
    });
  }
});

/**
 * GET /api/vulnerabilities/search?q=query
 * Busca vulnerabilidades por término de búsqueda
 */
router.get('/search/query', (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string || '').toLowerCase();

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Parámetro de búsqueda "q" es requerido',
      });
    }

    const results = vulnerabilities.filter((vuln) => {
      return (
        vuln.title.toLowerCase().includes(query) ||
        vuln.code.toLowerCase().includes(query) ||
        vuln.shortTitle.toLowerCase().includes(query) ||
        vuln.description.some((desc) => desc.toLowerCase().includes(query)) ||
        vuln.commonVulnerabilities.some((cv) => cv.toLowerCase().includes(query))
      );
    });

    const resultsList: VulnerabilityListItem[] = results.map((vuln) => ({
      id: vuln.id,
      code: vuln.code,
      title: vuln.title,
      shortTitle: vuln.shortTitle,
      icon: vuln.icon,
      rank: vuln.overview.rank,
      incidenceRate: vuln.overview.incidenceRate,
      description: vuln.overview.description,
    }));

    res.json({
      success: true,
      data: resultsList,
      total: resultsList.length,
      query,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al buscar vulnerabilidades',
    });
  }
});

export default router;
