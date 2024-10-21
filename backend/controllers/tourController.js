import Tour from "../models/Tour.js"

// Create new tour
export const createTour = async (req, res) => {
    const newTour = new Tour(req.body)
    try {
        const savedTour = await newTour.save();
        res.status(200).json({
            success: true,
            message: "Tạo tour mới thành công",
            data: savedTour
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Tạo tour mới thất bại"
        })
    }
};

// Update tour
export const updateTour = async (req, res) => {
    const id = req.params.id
    try {
        const updatedTour = await Tour.findByIdAndUpdate(id, {
            $set: req.body
        }, { new: true })
        res.status(200).json({
            success: true,
            message: "Cập nhật tour thành công",
            data: updateTour
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Cập nhật tour thất bại"
        })
    }
}

// Delete tour
export const deleteTour = async (req, res) => {
    const id = req.params.id
    try {
        await Tour.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Xóa tour thành công",
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Xóa tour thất bại"
        })
    }
}

// Get single tour
export const getSingleTour = async (req, res) => {
    const id = req.params.id
    try {
        const tour = await Tour.findById(id);
        res.status(200).json({
            success: true,
            message: "Tìm thấy tour phù hợp",
            data: tour
        });
    }
    catch (err) {
        res.status(404).json({
            success: false,
            message: "Không tìm thấy tour phù hợp"
        })
    }
}

// Get all tours
export const getAllTours = async (req, res) => {

    // for pagination
    const page = parseInt(req.query.page)
    console.log(page);

    try {
        const tours = await Tour.find({})
        res.status(200).json({
            success: true,
            message: "Tìm thấy các tour phù hợp",
            data: tours
        })
    } 
    catch (error) {
        res.status(404).json({
            success: false,
            message: "Không tìm thấy tour phù hợp"
        })
    }
}