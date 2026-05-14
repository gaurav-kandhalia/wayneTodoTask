import { List } from "../models/list.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";


// CREATE LIST

export const createList = asyncHandler(async (req, res) => {

    const { title } = req.body;

    if (!title) {
        throw new ApiError(400, "List title is required");
    }

    const list = await List.create({
        title,
        owner: req.user._id,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            list,
            "List created successfully"
        )
    );

});


// GET ALL USER LISTS

export const getUserLists = asyncHandler(async (req, res) => {

    const lists = await List.find({
        $or: [
            { owner: req.user._id },
            { collaborators: req.user._id }
        ]
    })
    .populate("owner", "name email")
    .populate("collaborators", "name email");

    return res.status(200).json(
        new ApiResponse(
            200,
            lists,
            "Lists fetched successfully"
        )
    );

});


// GET SINGLE LIST

export const getSingleList = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const list = await List.findById(id)
        .populate("owner", "name email")
        .populate("collaborators", "name email");

    if (!list) {
        throw new ApiError(404, "List not found");
    }

    const isOwner = list.owner._id.toString() === req.user._id.toString();

    const isCollaborator = list.collaborators.some(
        (collaborator) =>
            collaborator._id.toString() === req.user._id.toString()
    );

    if (!isOwner && !isCollaborator) {
        throw new ApiError(403, "Access denied");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            list,
            "List fetched successfully"
        )
    );

});


// DELETE LIST

export const deleteList = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const list = await List.findById(id);

    if (!list) {
        throw new ApiError(404, "List not found");
    }

    if (list.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only owner can delete list");
    }

    await List.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "List deleted successfully"
        )
    );

});