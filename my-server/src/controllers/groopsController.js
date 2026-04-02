import Groops from "../models/Groops.js";

//Groop crud
//creating a groop
export const createGroop = async (req, res) => {
  try {
    const groops = await Groops.create({ ...req.body, user: req.user._id });
    res.status(201).json(groops);
  } catch (error) {
    res.status(400).json({ msg: `error creating groop ${error.message}` });
  }
};
//requesting all groops
export const getGroops = async (req, res) => {
  try {
    const groops = await Groops.find({ user: req.user._id });
    res.status(200).json(groops);
  } catch (error) {
    res.status(400).json({ msg: `error creating groop ${error.message}` });
  }
};
//deleting a groop
export const deleteGroop = async (req, res) => {
  try {
    const deletedGroop = await Groops.findByIdAndDelete(req.params.id);
    if (!deletedGroop) return res.status(404).json({ msg: "Groop not found" });
    res.status(200).json(deletedGroop);
  } catch (error) {
    res.status(400).json({ msg: `error creating groop ${error.message}` });
  }
};
//update a groop
export const updateGroop = async (req, res) => {
  try {
    const updateGroop = await Groops.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );
    if (!updateGroop) return res.status(404).json({ msg: "Groop not found" });
    res.status(200).json(updateGroop);
  } catch (error) {
    res.status(400).json({ msg: `error creating groop ${error.message}` });
  }
};
