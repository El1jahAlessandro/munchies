export function createFormData(object: object) {
    const formData = new FormData();
    Object.entries(object).forEach(([key, value]) => {
        if (value) {
            formData.append(key.toString(), value.toString());
        }
    });
    return formData;
}
