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

    // Decode URL in case category has spaces or special chars
    const category = decodeURIComponent(req.params.category);

    //const activities = await Activity.find().sort({ date: -1 });
    
    // Optionally, make it case-insensitive
    const activities = await Activity.find({ category: new RegExp(`^${category}$`, 'i') })
      .sort({ date: -1 });

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

// Update activity — ONLY admin can update
exports.updateActivity = async (req, res) => {
  try {
    const activityId = req.params.id;

    // Check if activity exists
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Admin only (req.user.role comes from JWT)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this activity' });
    }

    // Fields allowed to update
    const { name, date, location, organizer, description, category } = req.body;

    // Update fields only if they were provided
    if (name) activity.name = name;
    if (date) activity.date = date;
    if (location) activity.location = location;
    if (organizer) activity.organizer = organizer;
    if (description) activity.description = description;
    if (category) activity.category = category;

    await activity.save();

    res.json({ message: 'Activity updated successfully', activity });

  } catch (error) {
    console.error('Update Activity Error:', error);
    res.status(500).json({ message: 'Server error updating activity' });
  }
};

// Get a single activity by ID — Admin only
exports.getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json(activity);
  } catch (error) {
    console.error('Error fetching activity by ID:', error);
    res.status(500).json({ message: 'Server error fetching activity' });
  }
};