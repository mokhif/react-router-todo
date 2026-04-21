import Group from "../models/Group.js";

//Group crud
//creating a group
export const createGroup = async (req, res) => {
  try {
    const group = await Group.create({ ...req.body, user: req.user._id });
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ msg: `error creating group ${error.message}` });
  }
};
//requesting all group
export const getUserGroups = async (req, res) => {
  try {
    const group = await Group.find({ user: req.user._id });
    res.status(200).json(group);
  } catch (error) {
    res.status(400).json({ msg: `error creating group ${error.message}` });
  }
};
//deleting a group
export const deleteGroupById = async (req, res) => {
  try {
    const deletedGroup = await Group.findByIdAndDelete(req.params.id);
    if (!deletedGroup) return res.status(404).json({ msg: "Group not found" });
    res.status(200).json(deletedGroup);
  } catch (error) {
    res.status(400).json({ msg: `error creating group ${error.message}` });
  }
};
//update a group
export const updateGroup = async (req, res) => {
  try {
    const updateGroup = await Group.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updateGroup) return res.status(404).json({ msg: "Group not found" });
    res.status(200).json(updateGroup);
  } catch (error) {
    res.status(400).json({ msg: `error creating group ${error.message}` });
  }
};
