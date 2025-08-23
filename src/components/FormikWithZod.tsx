/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { simulatedApi } from '../api/api.ts';
import type { FormData } from '../types/types';
import z from 'zod';
import { FieldArray, useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';

// 🎯 Schema-first approach - this defines EVERYTHING!
const formSchema = z.object({
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'You must be at least 18 years old'),
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Gender is required' }),
  }),
  address: z.object({
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
  }),
  hobbies: z
    .array(
      z.object({
        name: z.string().min(1, 'Hobby name is required'),
      }),
    )
    .min(1, 'At least one hobby is required'),
  startDate: z.date(),
  subscribe: z.boolean(),
  referral: z.string().default(''),
});

export const FormikWithZod: React.FC = () => {
  // const [formData, setFormData] = useState<FormData>({
  //   firstName: '',
  //   lastName: '',
  //   email: '',
  //   age: 18,
  //   gender: '',
  //   address: { city: '', state: '' },
  //   hobbies: [{ name: '' }],
  //   startDate: new Date(),
  //   subscribe: false,
  //   referral: '',
  // });
  //
  // const [errors, setErrors] = useState<any>({});
  // const [isSubmitting, setIsSubmitting] = useState(false);

  // ✨ Single hook replaces all that useState mess!
  // const formik = useFormik<FormData>({
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    isSubmitting,
  } = useFormik<FormData>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      age: 18,
      gender: '',
      address: { city: '', state: '' },
      hobbies: [{ name: '' }],
      startDate: new Date(),
      subscribe: false,
      referral: '',
    },
    onSubmit: async () => {},
    validationSchema: toFormikValidationSchema(formSchema),
  });

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: 5 }}
    >
      <div>
        <label>First Name</label>
        <input
          name='firstName'
          // value={formData.firstName}
          value={values.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {/*{errors.firstName && (*/}
        {touched.firstName && errors.firstName && (
          <p style={{ color: 'orangered' }}>{errors.firstName}</p>
        )}
      </div>

      <div>
        <label>Last Name</label>
        <input
          name='lastName'
          // value={formData.lastName}
          value={values.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {/*{errors.lastName && (*/}
        {touched.lastName && errors.lastName && (
          <p style={{ color: 'orangered' }}>{errors.lastName}</p>
        )}
      </div>

      <div>
        <label>Email</label>
        {/*<input name='email' value={formData.email} onChange={handleChange} />*/}
        <input
          name='email'
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {/*{errors.email && <p style={{ color: 'orangered' }}>{errors.email}</p>}*/}
        {touched.email && errors.email && (
          <p style={{ color: 'orangered' }}>{errors.email}</p>
        )}
      </div>

      <div>
        <label>Age</label>
        <input
          type='number'
          name='age'
          // value={formData.age}
          value={values.age}
          // onChange={handleChange}
          onChange={(e) => setFieldValue('age', parseInt(e.target.value) || 0)} // need to change into number value
          onBlur={handleBlur}
        />
        {errors.age && <p style={{ color: 'orangered' }}>{errors.age}</p>}
      </div>

      <div>
        <label>Gender</label>
        {/*<select name='gender' value={formData.gender} onChange={handleChange}>*/}
        <select
          name='gender'
          value={values.gender}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value=''>Select...</option>
          <option value='male'>Male</option>
          <option value='female'>Female</option>
          <option value='other'>Other</option>
        </select>
        {errors.gender && <p style={{ color: 'orangered' }}>{errors.gender}</p>}
      </div>

      <div>
        <label>Address</label>
        <input
          name='city'
          // value={formData.address.city}
          value={values.address.city}
          // onChange={(e) =>
          //   handleChange({
          //     ...e,
          //     target: { ...e.target, name: 'address.city' },
          //   })
          // }
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder='City'
        />
        {/*{errors.address?.city && (*/}
        {touched.address?.city && errors.address?.city && (
          <p style={{ color: 'orangered' }}>{errors.address.city}</p>
        )}

        <input
          name='state'
          // value={formData.address.state}
          value={values.address.state}
          // onChange={(e) =>
          //   handleChange({
          //     ...e,
          //     target: { ...e.target, name: 'address.state' },
          //   })
          // }
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder='State'
        />
        {/*{errors.address?.state && (*/}
        {touched.address?.state && errors.address?.state && (
          <p style={{ color: 'orangered' }}>{errors.address.state}</p>
        )}
      </div>

      <div>
        <label>Start Date</label>
        <DatePicker
          // selected={formData.startDate}
          selected={values.startDate}
          // onChange={(date: Date | null) =>
          //   setFormData({ ...formData, startDate: date || new Date() })
          // }
          onChange={(date: Date | null) =>
            setFieldValue('startDate', date || new Date())
          }
        />
      </div>

      <div>
        <label>Hobbies</label>
        {/*        {formData.hobbies.map((hobby, index) => (
          <div key={index}>
            <input
              name='name'
              value={hobby.name}
              onChange={(e) => handleHobbyChange(index, e)}
              placeholder='Hobby Name'
            />
            {errors.hobbies?.[index]?.name && (
              <p style={{ color: 'orangered' }}>{errors.hobbies[index].name}</p>
            )}

            {formData.hobbies.length > 1 && (
              <button type='button' onClick={() => removeHobby(index)}>
                Remove Hobby
              </button>
            )}
          </div>
        ))}
        <button type='button' onClick={addHobby}>
          Add Hobby
        </button>*/}
        <FieldArray name='hobbies'>
          {({ push, remove }) => {
            return (
              <div>
                {formData.hobbies.map((hobby, index) => (
                  <div key={index}>
                    <input
                      name='name'
                      value={hobby.name}
                      // onChange={(e) => handleHobbyChange(index, e)}
                      onChange={handleChange} // The handleChange can use the parent one?!?!
                      onBlur={handleBlur}
                      placeholder='Hobby Name'
                    />
                    {errors.hobbies?.[index]?.name && (
                      <p style={{ color: 'orangered' }}>
                        {errors.hobbies[index].name}
                      </p>
                    )}

                    {formData.hobbies.length > 1 && (
                      <button type='button' onClick={() => removeHobby(index)}>
                        Remove Hobby
                      </button>
                    )}
                  </div>
                ))}
                <button type='button' onClick={addHobby}>
                  Add Hobby
                </button>
              </div>
            );
          }}
        </FieldArray>
      </div>

      <div>
        <label htmlFor='sub'>Subscribe to Newsletter</label>
        <input
          type='checkbox'
          id='sub'
          name='subscribe'
          checked={formData.subscribe}
          onChange={(e) =>
            setFormData({ ...formData, subscribe: e.target.checked })
          }
        />
      </div>

      {formData.subscribe && (
        <div>
          <label>Referral Source</label>
          <input
            name='referral'
            value={formData.referral}
            onChange={handleChange}
            placeholder='How did you hear about us?'
          />
          {errors.referral && (
            <p style={{ color: 'orangered' }}>{errors.referral}</p>
          )}
        </div>
      )}

      {errors.root && <p style={{ color: 'red' }}>{errors.root}</p>}

      <button type='submit' disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};
