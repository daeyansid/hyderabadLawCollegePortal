exports.validateRequiredFields = (fields) => {
    const missingFields = [];
    for (const [key, value] of Object.entries(fields)) {
        if (value === undefined || value === null || value === '') {
            missingFields.push(key);
        }
    }
    return missingFields;
};
