require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Career = require('../models/Career');

const details = [
  {
    name: 'Software Developer',
    dayInLife: 'Most days involve writing and reviewing code, fixing bugs, attending a short team stand-up meeting, and collaborating with designers or product managers on what to build next. Deep focus time for coding is usually blocked out, interrupted by code reviews and questions from teammates.',
    pros: ['High demand across almost every industry', 'Remote work is common', 'Clear skill-based growth path', 'Strong starting salaries relative to many fields'],
    cons: ['Can involve long hours near deadlines', 'Technology changes fast, requiring continuous learning', 'Sitting for long periods can affect health if not managed', 'Debugging can be mentally exhausting'],
    industryOutlook: 'Consistently strong demand in India and globally, though entry-level hiring has become more competitive — strong fundamentals and projects matter more than ever.',
  },
  {
    name: 'Cybersecurity Analyst',
    dayInLife: 'Monitoring security dashboards for unusual activity, investigating alerts, patching vulnerabilities, and occasionally responding urgently to an active security incident. Documentation and reporting take up more time than people expect.',
    pros: ['Very high demand, often more roles than qualified people', 'Work feels meaningful — protecting real systems and people', 'Strong salary growth with experience', 'Many specializations to grow into'],
    cons: ['On-call or incident response can disrupt personal time', 'Requires constant learning as threats evolve', 'Can be high-pressure during active incidents', 'Entry often requires certifications beyond a degree'],
    industryOutlook: 'One of the fastest-growing fields globally as more business moves online — demand is expected to keep outpacing supply for years.',
  },
  {
    name: 'Data Analyst',
    dayInLife: 'Pulling and cleaning data, building reports/dashboards, and presenting findings to non-technical stakeholders who need to make decisions based on your analysis. A lot of the job is translating numbers into a clear story.',
    pros: ['Good entry point into the broader data field', 'Transferable skills across industries', 'Logical, structured day-to-day work', 'Can progress into Data Science or Analytics Management'],
    cons: ['Can feel repetitive in some roles', 'Communicating insights to non-technical people is a real skill gap for many', 'Entry-level roles can be underpaid relative to the skill required', 'Quality of data you work with is often out of your control'],
    industryOutlook: 'Steady, strong demand as more companies become data-driven — a reliable stepping stone into higher-paying data roles.',
  },
  {
    name: 'Data Engineer',
    dayInLife: 'Building and maintaining the pipelines that move and clean data for others to use — a mix of coding, debugging pipeline failures, and working closely with Data Analysts and ML Engineers who depend on your work.',
    pros: ['High pay relative to years of experience', 'Less public-facing pressure than analyst roles', 'In growing demand as companies scale their data use', 'Deep technical skill-building'],
    cons: ['Infrastructure work can feel invisible — less recognition than analysis', 'Debugging pipeline failures can be tedious', 'Requires strong software engineering fundamentals, not just data knowledge'],
    industryOutlook: 'Growing fast — as companies collect more data, they need more people to build reliable systems around it.',
  },
  {
    name: 'Machine Learning Engineer',
    dayInLife: 'Experimenting with models, tuning performance, and — often underestimated — spending significant time on data cleaning and deployment infrastructure rather than just "building AI."',
    pros: ['Cutting-edge, high-growth field', 'Strong compensation', 'Intellectually engaging work', 'High visibility in a company\'s tech strategy'],
    cons: ['Highly competitive to break into', 'Real-world ML is less glamorous than it sounds — lots of data wrangling', 'Requires strong math/stats foundation', 'Fast-moving field requires continuous study'],
    industryOutlook: 'Among the fastest-growing tech fields; competition for roles is intense, so strong fundamentals and real projects matter a lot.',
  },
  {
    name: 'Cloud Engineer',
    dayInLife: 'Managing cloud infrastructure, automating deployments, monitoring system performance and costs, and troubleshooting when something goes down — often under time pressure since outages affect real users.',
    pros: ['Strong demand as companies migrate to cloud', 'Good remote-work availability', 'Clear certification path (AWS/Azure/GCP) to prove skill', 'Solid salary growth'],
    cons: ['On-call responsibilities for production issues', 'Certifications require ongoing investment of time/money', 'Can be high-pressure during outages'],
    industryOutlook: 'Strong and growing as more infrastructure moves to the cloud — a genuinely future-proof specialization within tech.',
  },
  {
    name: 'DevOps Engineer',
    dayInLife: 'Automating software release pipelines, maintaining build/test/deploy systems, and often being the first responder when a deployment breaks something in production.',
    pros: ['High demand, central role in engineering teams', 'Strong pay', 'Broad technical exposure across the whole software lifecycle'],
    cons: ['Can be high-stress, especially around releases', 'On-call rotations are common', 'Requires broad knowledge across many tools, which takes time to build'],
    industryOutlook: 'Consistently strong demand — nearly every tech company needs reliable deployment and infrastructure practices.',
  },
  {
    name: 'UI/UX Designer',
    dayInLife: 'Sketching wireframes, building interactive prototypes, conducting user interviews or usability tests, and defending design decisions in meetings with engineers and product managers.',
    pros: ['Creative and analytical work combined', 'Strong demand as companies prioritize user experience', 'Portfolio-driven — your work speaks for itself', 'Can freelance or work remotely'],
    cons: ['Subjective feedback can be frustrating ("make it pop")', 'Often the first area cut during budget tightening', 'Building a strong portfolio takes real time before landing a first role'],
    industryOutlook: 'Healthy demand, especially for designers who can also think about business impact, not just visuals.',
  },
  {
    name: 'Graphic Designer',
    dayInLife: 'Designing visual assets for campaigns, branding, and social media — often juggling multiple small projects with tight turnaround times and client/stakeholder revisions.',
    pros: ['Highly creative work', 'Freelance opportunities are abundant', 'Visible, tangible output', 'Low barrier to starting (portfolio over degree, often)'],
    cons: ['Can be undervalued/underpaid, especially freelance', 'Revision cycles can be draining', 'Market is crowded, so differentiation matters'],
    industryOutlook: 'Stable demand, though AI design tools are changing the entry-level landscape — specialization and strong taste matter more than ever.',
  },
  {
    name: 'Product Manager',
    dayInLife: 'A mix of meetings — with engineering, design, and business stakeholders — prioritizing what gets built next, writing specs, and constantly balancing competing demands with limited resources.',
    pros: ['High pay and high influence over what gets built', 'Intellectually varied work', 'Strong career ceiling', 'Transferable skill set across industries'],
    cons: ['Can feel like you have responsibility without direct authority', 'Meeting-heavy days', 'Success is hard to attribute to one person, which can be frustrating', 'Often requires prior experience in another function first'],
    industryOutlook: 'Strong demand, though often considered a role to grow into after some years of experience rather than a typical first job.',
  },
  {
    name: 'Business Analyst',
    dayInLife: 'Gathering requirements from stakeholders, documenting processes, and acting as the translator between what the business needs and what technical teams can build.',
    pros: ['Good entry point into both tech and business tracks', 'Broad exposure across departments', 'Transferable skills', 'Clear path toward Product Management or Consulting'],
    cons: ['Can involve being caught between conflicting stakeholder demands', 'Less hands-on/technical than some may want', 'Success depends heavily on communication skill, which takes time to build'],
    industryOutlook: 'Stable, steady demand — a reliable, flexible career base that opens multiple future directions.',
  },
  {
    name: 'Digital Marketing Specialist',
    dayInLife: 'Running and optimizing ad campaigns, analyzing performance metrics, creating content calendars, and constantly testing what resonates with an audience.',
    pros: ['Low barrier to entry, skills-based over degree-based', 'Creative and analytical mix', 'High freelance/remote potential', 'Visible, measurable impact'],
    cons: ['Fast-changing platforms require constant adaptation', 'Results can be unpredictable despite effort', 'Can be undervalued in traditional industries'],
    industryOutlook: 'Strong and growing as more business shifts online, though the skill bar keeps rising as the field matures.',
  },
  {
    name: 'Financial Analyst',
    dayInLife: 'Building financial models, analyzing company or market performance, and preparing reports that inform investment or business decisions — heavy use of spreadsheets and presentations.',
    pros: ['Strong starting salaries in finance hubs', 'Clear, structured career ladder', 'Transferable analytical skills', 'Path toward CFA/MBA for further growth'],
    cons: ['Can involve long hours, especially in investment banking-adjacent roles', 'High-pressure, detail-critical work', 'Entry can be competitive without the right credentials'],
    industryOutlook: 'Stable, consistent demand — a traditional but reliable career path in finance and corporate roles.',
  },
  {
    name: 'Chartered Accountant',
    dayInLife: 'Auditing financial statements, ensuring tax compliance, and advising clients or employers on financial strategy — often with strict deadlines around filing periods.',
    pros: ['Highly respected, stable profession in India', 'Strong long-term earning potential', 'Clear credentialing path (ICAI)', 'High demand across every industry'],
    cons: ['The CA qualification itself is rigorous and takes years', 'Can involve intense workload during audit/tax seasons', 'Early career (article-ship) pay is modest'],
    industryOutlook: 'Consistently strong demand — every company needs financial compliance, regardless of economic conditions.',
  },
  {
    name: 'Content Writer / Journalist',
    dayInLife: 'Researching topics, writing and editing drafts, and (for journalists) chasing sources and meeting tight publishing deadlines. Freelance writers often juggle multiple clients at once.',
    pros: ['Low barrier to entry — a portfolio can open doors without a specific degree', 'Flexible/remote work is common', 'Creative, intellectually engaging work', 'Transferable to content marketing, copywriting, and more'],
    cons: ['Pay can be low, especially freelance or early career', 'Journalism specifically faces industry instability', 'Constant deadline pressure', 'Competitive field with many entrants'],
    industryOutlook: 'Traditional journalism is contracting, but content writing (marketing, SEO, technical writing) is growing steadily.',
  },
  {
    name: 'Civil Engineer',
    dayInLife: 'Split between office work (design, planning, calculations) and site visits to oversee construction progress, often coordinating with contractors and ensuring safety compliance.',
    pros: ['Tangible, visible impact — you can point to real buildings/infrastructure', 'Strong government job eligibility via GATE', 'Essential, recession-resistant field', 'Clear licensing/credentialing path'],
    cons: ['Site work can mean long hours outdoors in tough conditions', 'Project delays and budget pressure are common', 'Career growth can be slower than in tech fields'],
    industryOutlook: 'Steady demand tied to infrastructure growth — India\'s ongoing urban development keeps this field consistently needed.',
  },
  {
    name: 'Mechanical Engineer',
    dayInLife: 'Designing or testing mechanical components (often using CAD software), running simulations, and working with manufacturing teams to bring designs into production.',
    pros: ['Broad, versatile degree applicable across many industries', 'Strong government job eligibility via GATE', 'Essential, stable field', 'Hands-on, tangible work'],
    cons: ['Can involve factory floor time in less comfortable conditions', 'Growth can be slower without further specialization', 'Automation is changing some traditional manufacturing roles'],
    industryOutlook: 'Stable, foundational field — automation is changing specific roles but not eliminating demand for mechanical expertise.',
  },
  {
    name: 'Electrical/Electronics Engineer',
    dayInLife: 'Designing and testing circuits or electrical systems, working through simulations and prototypes, and troubleshooting when a design doesn\'t behave as expected.',
    pros: ['Versatile across power, electronics, telecom, and more', 'Strong government job eligibility via GATE', 'Growing relevance in renewable energy and IoT', 'Essential, stable field'],
    cons: ['Lab/testing work can be slow and detail-heavy', 'Entry-level pay can be modest outside top companies', 'Keeping up with fast-evolving electronics tech takes effort'],
    industryOutlook: 'Growing relevance thanks to renewable energy, electric vehicles, and IoT expansion on top of traditional demand.',
  },
  {
    name: 'Doctor (MBBS)',
    dayInLife: 'Seeing patients, diagnosing conditions, prescribing treatment, and — especially during internship/residency — working long, demanding hospital shifts with significant responsibility.',
    pros: ['Deeply meaningful, respected work', 'Strong long-term earning potential', 'Lifelong learning and intellectual challenge', 'Essential profession, recession-proof'],
    cons: ['Extremely long training path (MBBS + internship + possibly specialization)', 'High-stress, emotionally demanding work', 'Long hours, especially early career', 'Highly competitive entrance exams (NEET)'],
    industryOutlook: 'Consistently essential — healthcare demand only grows, especially as India\'s population and healthcare access expand.',
  },
  {
    name: 'Psychologist / Counsellor',
    dayInLife: 'Conducting one-on-one or group counselling sessions, assessing client needs, and (for clinical roles) developing treatment plans — emotionally demanding, deeply human work.',
    pros: ['Meaningful, people-centered work', 'Growing awareness/demand for mental health support in India', 'Flexible practice options (private practice, institutions, online)', 'Intellectually rich field'],
    cons: ['Emotionally taxing — risk of burnout without good boundaries', 'Building a client base (especially private practice) takes time', 'Can require further specialization (M.A./PhD) for higher-paying roles'],
    industryOutlook: 'Growing steadily as mental health awareness increases in India, though still an emerging/undervalued market compared to the West.',
  },
  {
    name: 'Teacher / Educator',
    dayInLife: 'Planning lessons, teaching classes, grading work, and spending real time outside class hours on preparation and student support — a role with more behind-the-scenes work than people expect.',
    pros: ['Deeply meaningful, shapes real lives', 'Stable government job path (via CTET/TET)', 'Predictable schedule (in most school settings)', 'Respected profession'],
    cons: ['Pay can be modest, especially in private schools', 'Classroom management can be genuinely difficult', 'Workload outside class hours is often underestimated', 'Limited salary growth without moving into administration'],
    industryOutlook: 'Stable, essential demand — education will always need teachers, though pay growth varies significantly by institution type.',
  },
];

const seed = async () => {
  await connectDB();

  for (const d of details) {
    await Career.findOneAndUpdate({ name: d.name }, d);
  }

  console.log(`Enriched ${details.length} careers with day-in-life, pros/cons, and outlook.`);
  mongoose.connection.close();
};

seed();