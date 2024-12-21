const validateCnic = (cnic) => {
    // Check if the CNIC matches the pattern 00000-0000000-0
    const cnicPattern = /^\d{5}-\d{7}-\d{1}$/;
    return cnicPattern.test(cnic);
};

const formatCnicDisplay = (cnic) => {
    // Format CNIC for display as 00000-0000000-0
    return cnic.replace(/^(\d{5})(\d{7})(\d{1})$/, "$1-$2-$3");
};

const handleGuardianCnicChange = (e) => {
    // Allow input with hyphens and restrict to the pattern 00000-0000000-0
    const inputCnic = e.target.value.replace(/[^0-9-]/g, ""); // Allow numbers and hyphens only

    // Add hyphens at the correct positions if not manually added
    let formattedCnic = inputCnic
        .replace(/^(\d{5})(\d)/, "$1-$2") // Insert hyphen after the first 5 digits
        .replace(/-(\d{7})(\d)/, "-$1-$2"); // Insert hyphen after the 7 digits following the first hyphen

    // Restrict to maximum length of 15 characters (13 digits + 2 hyphens)
    if (formattedCnic.length <= 15) {
        setFormData({ ...formData, guardianId: formattedCnic });
    }
};