import { z } from 'zod';

function checkFormData(formData: FormDataEntryValue | null) {
    return formData !== 'undefined' && formData !== null ? formData : undefined;
}

export function getFormDataValues<DataSchemaType extends z.Schema>(
    formData: FormData,
    dataSchema: DataSchemaType,
    propertyKeys: string[]
) {
    // get the checked formdata value from each schema key
    const properties = propertyKeys.reduce((previousProperties, currentKey) => {
        return {
            ...previousProperties,
            [currentKey]: checkFormData(formData.get(currentKey)),
        };
    }, {});
    return {
        ...dataSchema.parse(properties),
    } as z.infer<typeof dataSchema>;
}
