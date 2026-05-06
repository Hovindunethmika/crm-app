const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(auth);

// GET /api/dashboard
router.get('/', async (req, res) => {
  try {
    const [leads, wonLeads] = await Promise.all([
      prisma.lead.findMany(),
      prisma.lead.findMany({ where: { status: 'Won' } }),
    ]);

    const stats = {
      totalLeads: leads.length,
      newLeads: leads.filter(l => l.status === 'New').length,
      qualifiedLeads: leads.filter(l => l.status === 'Qualified').length,
      wonLeads: wonLeads.length,
      lostLeads: leads.filter(l => l.status === 'Lost').length,
      totalDealValue: leads.reduce((sum, l) => sum + l.dealValue, 0),
      wonDealValue: wonLeads.reduce((sum, l) => sum + l.dealValue, 0),
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
});

module.exports = router;