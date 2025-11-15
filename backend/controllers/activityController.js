const Activity = require('../models/activity');

exports.createActivity = async (req, res) => {
  try {
    const { name, date, location, organizer, description, category } = req.body;

    if (!name || !date || !location || !organizer || !description || !category) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newActivity = new Activity({
      name,
      date,
      location,
      organizer,
      description,
      category,
      createdBy: req.user.id // user id from JWT
    });

    await newActivity.save();

    res.status(201).json({ message: 'Activity created successfully!', newActivity });
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ message: 'Server error creating activity' });
  }
};

// Allow admin or creator to delete an activity
exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Allow admin or creator
    if (req.user.role !== 'admin' && activity.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this activity' });
    }

    await activity.deleteOne();
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Delete Activity Error:', error);
    res.status(500).json({ message: 'Server error deleting activity' });
  }
};

// Get all activities (accessible by all authenticated users)
exports.getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ date: -1 });
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Server error fetching activities' });
  }
};

// Get activities by category
exports.getActivitiesByCategory = async (req, res) => {
  try {
    const category = req.params.category;

    // Find activities matching category
    const activities = await Activity.find({ category }).sort({ date: -1 });

    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities by category:', error);
    res.status(500).json({ message: 'Server error fetching activities by category' });
  }
};
