const { createCareer, updateCareer, deleteCareer } = require('../services/careerService');
const Skill = require('../models/Skill');

const addCareer = async (req, res) => {
  try {
    const career = await createCareer(req.body);
    res.status(201).json({ message: 'Career created', career });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

const editCareer = async (req, res) => {
  try {
    const career = await updateCareer(req.params.id, req.body);
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

module.exports = { addCareer, editCareer, removeCareer, listSkills, addSkill };