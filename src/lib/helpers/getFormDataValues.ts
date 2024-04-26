import { z } from 'zod';
import { assign } from 'lodash';

function checkFormData(formData: FormDataEntryValue | null) {
    return formData !== 'undefined' && formData !== null ? formData : undefined;
}

export function getFormDataValues<DataSchemaType extends z.Schema>(
    formData: FormData,
    dataSchema: DataSchemaType,
    propertyKeys: string[]
) {
    // get the checked formdata value from each schema key
    const properties = propertyKeys
        .map(key => {
            return {
                [key]: checkFormData(formData.get(key)),
            };
        })
        // convert Array of Objects into one single Object
        .reduce(function (memo, current) {
            return assign(memo, current);
        }, {});
    return {
        ...dataSchema.parse(properties),
    } as z.infer<typeof dataSchema>;
}
