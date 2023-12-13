import { CAR_NAME_MAPPINGS } from "./name_mappings"

describe('name mappings', () => {
    test('should map car name correctly', () => {
        expect(CAR_NAME_MAPPINGS['ddm_toyota_mrs_haru']).toBe('Toyota MRS Haru Spec')
    })
}) 