const Activity = require('../models/activity');

exports.createActivity = async (req, res) => {
  try {
    const { name, date, location, organizer, description, category } = req.body;

    const newActivity = new Activity({
      name,
      date,
      location,
      organizer,
      description,
      category,
    });

    await newActivity.save();

    res.status(201).json({ message: 'Activity created successfully!', activity: newActivity });
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ message: 'Server error creating activity' });
  }
};