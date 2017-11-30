class ComponentInformationSpecHelper
  def self.reset_component_information(sources)
    sources << [{ 'name' => 'kaiju' }, 'lib/kaiju/Placeholder.json']
    sources << [{ 'name' => 'kaiju' }, 'lib/kaiju/Workspace.json']
    ComponentInformation.instance_variable_set(
      :@cached_components, IceNine.deep_freeze(Hash[ComponentInformation.gather_components(sources)])
    )
  end
end
