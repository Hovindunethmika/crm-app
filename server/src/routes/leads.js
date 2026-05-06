const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// All routes protected
router.use(auth);

// GET /api/leads — get all leads with optional filters
router.get('/', async (req, res) => {
  const { status, source, salesperson, search } = req.query;

  try {
    const leads = await prisma.lead.findMany({
      where: {
        AND: [
          status ? { status } : {},
          source ? { source } : {},
          salesperson ? { salesperson: { contains: salesperson, mode: 'insensitive' } } : {},
          search ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { company: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          } : {},
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// GET /api/leads/:id — get single lead with notes
router.get('/:id', async (req, res) => {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        notes: {
          orderBy: { createdAt: 'desc' },
          include: { createdBy: { select: { name: true } } },
        },
      },
    });
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
});

// POST /api/leads — create lead
router.post('/', async (req, res) => {
  const { name, company, email, phone, source, salesperson, status, dealValue } = req.body;

  try {
    const lead = await prisma.lead.create({
      data: {
        name,
        company,
        email,
        phone,
        source,
        salesperson,
        status: status || 'New',
        dealValue: parseFloat(dealValue) || 0,
      },
    });
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

// PUT /api/leads/:id — update lead
router.put('/:id', async (req, res) => {
  const { name, company, email, phone, source, salesperson, status, dealValue } = req.body;

  try {
    const lead = await prisma.lead.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        company,
        email,
        phone,
        source,
        salesperson,
        status,
        dealValue: parseFloat(dealValue) || 0,
      },
    });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// DELETE /api/leads/:id — delete lead
router.delete('/:id', async (req, res) => {
  try {
    await prisma.lead.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

// POST /api/leads/:id/notes — add note
router.post('/:id/notes', async (req, res) => {
  const { content } = req.body;

  try {
    const note = await prisma.note.create({
      data: {
        content,
        leadId: parseInt(req.params.id),
        createdById: req.user.id,
      },
      include: {
        createdBy: { select: { name: true } },
      },
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add note' });
  }
});

module.exports = router;