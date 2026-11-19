const Sector = require('../models/Sector');
const Category = require('../models/Category');
const Career = require('../models/Career');

const getAllSectors = async () => {
  const sectors = await Sector.find({ isActive: true }).sort({ displayOrder: 1 });

  const withCounts = await Promise.all(
    sectors.map(async (sector) => {
      const categoryCount = await Category.countDocuments({ sector: sector._id, isActive: true });
      const careerCount = await Career.countDocuments({ sectorRef: sector._id });
      return {
        _id: sector._id,
        name: sector.name,
        slug: sector.slug,
        description: sector.description,
        icon: sector.icon,
        categoryCount,
        careerCount,
      };
    })
  );

  return withCounts;
};

const getSectorBySlug = async (slug) => {
  const sector = await Sector.findOne({ slug, isActive: true });
  if (!sector) return null;

  const categories = await Category.find({ sector: sector._id, isActive: true }).sort({ displayOrder: 1 });

  const categoriesWithCareers = await Promise.all(
    categories.map(async (cat) => {
      const careers = await Career.find({ categoryRef: cat._id }).select(
        'name slug description sector approxStartingSalary'
      );
      return {
        _id: cat._id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        careers,
      };
    })
  );

  return {
    sector: { _id: sector._id, name: sector.name, slug: sector.slug, description: sector.description, icon: sector.icon },
    categories: categoriesWithCareers,
  };
};

module.exports = { getAllSectors, getSectorBySlug };