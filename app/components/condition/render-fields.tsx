export const renderFields = (field: Field) => {
  if (!field.enabled) return null;

  const handleChange = (value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field.id]: value,
    }));
  };

  switch (field.type) {
    case "select":
      const options = field.options ? JSON.parse(field.options) : [];
      return (
        <div key={field.id} className="space-y-2">
          <label className="block text-sm font-medium">{field.name}</label>
          <select
            value={formData[field.id] || ""}
            onChange={(e) => handleChange(e.target.value)}
            className="mt-1 block w-full bg-white rounded-md border border-gray-300 p-2"
            required={field.required}
          >
            <option value="">Select {field.name}</option>
            {options.map((opt: string) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );

    case "number":
      return (
        <div key={field.id} className="space-y-2">
          <label className="block text-sm font-medium">{field.name}</label>
          <input
            type="number"
            value={formData[field.id] || ""}
            onChange={(e) => handleChange(e.target.value)}
            className="mt-1 block w-full bg-white rounded-md border border-gray-300 p-2"
            required={field.required}
          />
        </div>
      );

    case "checkbox":
      return (
        <div key={field.id} className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData[field.id] || false}
              onChange={(e) => handleChange(e.target.checked)}
              className="rounded border-gray-300"
              required={field.required}
            />
            <span className="text-sm">{field.name}</span>
          </label>
        </div>
      );

    case "text":
    default:
      return (
        <div key={field.id} className="space-y-2">
          <label className="block text-sm font-medium">{field.name}</label>
          <input
            type="text"
            value={formData[field.id] || ""}
            onChange={(e) => handleChange(e.target.value)}
            className="mt-1 block w-full bg-white rounded-md border border-gray-300 p-2"
            required={field.required}
          />
        </div>
      );
  }
};
