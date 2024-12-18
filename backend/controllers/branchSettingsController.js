// backend/controllers/branchSettingsController.js

const BranchSetting = require('../models/BranchSettings');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');

// GET Branch Settings by Branch ID
exports.getBranchSettingsByBranchId = async (req, res) => {
    const { branchId } = req.params;

    try {
        const branchSetting = await BranchSetting.findOne({ branchId }).populate('branchId', 'branchName branchAddress');
        if (!branchSetting) {
            return sendErrorResponse(res, 404, 'Branch Settings not found.');
        }

        return sendSuccessResponse(res, 200, 'Branch Settings retrieved successfully.', branchSetting);
    } catch (error) {
        console.error('Error fetching Branch Settings:', error);
        return sendErrorResponse(res, 500, 'Server error.', error);
    }
};
