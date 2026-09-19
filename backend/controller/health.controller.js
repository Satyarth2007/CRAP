export const healthCheck = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Placement Recruitment API is running",
        timestamp: new Date().toISOString(),
    });
};