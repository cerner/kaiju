module ComponentsHelper
  def update_component(workspace, component, data)
    props = data['props'].as_json
    PropsSanatizer.sanatize_props(component, props)
    workspace.add_change(component, nil, 'update') do
      Kaiju::ComponentFactory.update_component(component, data['type'], data['props'].as_json)
    end
  end
end
