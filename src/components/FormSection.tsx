import './FormSection.css'

interface Field {
  label: string
  name: string
  type: string
  value: string
}

interface FormSectionProps {
  title: string
  fields: Field[]
  onChange: (field: string, value: string) => void
}

const FormSection = ({ title, fields, onChange }: FormSectionProps) => {
  return (
    <div className="form-section">
      <h2 className="section-title">{title}</h2>
      <div className="fields-container">
        {fields.map((field) => (
          <div key={field.name} className="form-field">
            <label htmlFor={field.name} className="field-label">
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                value={field.value}
                onChange={(e) => onChange(field.name, e.target.value)}
                className="field-input field-textarea"
                rows={4}
              />
            ) : (
              <input
                id={field.name}
                type={field.type}
                name={field.name}
                value={field.value}
                onChange={(e) => onChange(field.name, e.target.value)}
                className="field-input"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FormSection
