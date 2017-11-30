module PropertiesHelper
  def update_property(params)
    update_property_with_value(
      params[:workspace_object],
      params[:property_object],
      params.fetch(:property, {}).as_json['value'],
      params
    )
  end

  def update_property_with_value(workspace, property, value, params = {})
    type = update_type(params)
    remove_ids(type, property, value)
    workspace.add_change(property.component, property, type) do
      Kaiju::PropertyFactory.update_property(type, property, value)
    end
  end

  def update_type(params)
    if params['insert_after'] == 'true'
      'insert_after'
    elsif params['insert_before'] == 'true'
      'insert_before'
    elsif params['append'] == 'true'
      'append'
    else
      'update'
    end
  end

  def remove_ids(type, property, props)
    property_id = property.id
    # If the action type is append we need to grab the schema of the child.
    property_id += '::0' if type == 'append'
    PropsSanatizer.sanatize_prop(property.component, property_id, props)
  end

  def destroy_property(workspace, property)
    type = 'destroy'
    workspace.add_change(property.component, property, type) do
      Kaiju::PropertyFactory.update_property(type, property, nil)
    end
  end
end
