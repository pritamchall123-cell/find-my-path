const { createCareer, updateCareer, deleteCareer } = require('../services/careerService');
const Skill = require('../models/Skill');
const { getAdminStats } = require('../services/adminStatsService');
const { listUsers } = require('../services/adminUserService');

const {
  createInstitution,
  updateInstitution,
  deleteInstitution,
} = require('../services/institutionService');

const addCareer = async (req, res) => {
  try {
    const career = await createCareer(req.body);
    res.status(201).json({ message: 'Career created', career });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

const pickCareerFields = (body = {}) => {
  const out = {};

  for (const key of ['name', 'category', 'description']) {
    if (body[key] !== undefined) {
      if (typeof body[key] !== 'string') {
        throw Object.assign(new Error(`${key} must be text`), { statusCode: 400 });
      }
      out[key] = body[key].trim();
    }
  }

  if (out.name === '') throw Object.assign(new Error('Name is required'), { statusCode: 400 });
  if (out.description === '') throw Object.assign(new Error('Description is required'), { statusCode: 400 });

  for (const key of ['responsibilities', 'entryLevelRoles']) {
    if (body[key] !== undefined) {
      if (!Array.isArray(body[key])) {
        throw Object.assign(new Error(`${key} must be a list`), { statusCode: 400 });
      }
      out[key] = body[key].map((s) => String(s).trim()).filter(Boolean);
    }
  }

  return out;
};

const editCareer = async (req, res) => {
  try {
    const career = await updateCareer(req.params.id, pickCareerFields(req.body));
    res.status(200).json({ message: 'Career updated', career });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

const removeCareer = async (req, res) => {
  try {
    await deleteCareer(req.params.id);
    res.status(200).json({ message: 'Career deleted' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

const listSkills = async (req, res) => {
  try {
    const skills = await Skill.find();
    res.status(200).json({ skills });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const addSkill = async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json({ message: 'Skill created', skill });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const addInstitution = async (req, res) => {
  try {
    const institution = await createInstitution(req.body);
    res.status(201).json({ message: 'College created', institution });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

const editInstitution = async (req, res) => {
  try {
    const institution = await updateInstitution(req.params.id, req.body);
    res.status(200).json({ message: 'College updated', institution });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

const removeInstitution = async (req, res) => {
  try {
    await deleteInstitution(req.params.id);
    res.status(200).json({ message: 'College deleted' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

const getStats = async (req, res) => {
  try {
    const stats = await getAdminStats();
    res.status(200).json({ stats });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const { search, role, verified, level, page, limit } = req.query;
    const result = await listUsers({ search, role, verified, level, page, limit });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  addCareer, editCareer, removeCareer, listSkills, addSkill,
  addInstitution, editInstitution, removeInstitution,
  getStats, getUsers
};