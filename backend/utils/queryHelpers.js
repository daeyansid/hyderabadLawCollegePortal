exports.getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

exports.getSort = (sortField, sortOrder) => {
    const sort = {};
    if (sortField && sortOrder) {
        sort[sortField] = sortOrder === 'desc' ? -1 : 1;
    }
    return sort;
};

exports.getDateFilter = (startDate, endDate) => {
    if (startDate && endDate) {
        return { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } };
    }
    return {};
};

exports.getSearchFilterUser = (search) => {
    if (search) {
        return {
            $or: [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { userRole: { $regex: search, $options: 'i' } },
            ],
        };
    }
    return {};
};


exports.getSearchFilterBranch = (search) => {
    if (search) {
        return {
            $or: [
                { branchName: { $regex: search, $options: 'i' } },
                { 'branchType.name': { $regex: search, $options: 'i' } },
                { startTime: { $regex: search, $options: 'i' } },
                { endTime: { $regex: search, $options: 'i' } },
                { 'assignedTo.username': { $regex: search, $options: 'i' } },
                { 'assignedTo.email': { $regex: search, $options: 'i' } },
            ],
        };
    }
    return {};
};