class ComponentInformationSpecHelper
  def self.reset_component_information(sources)
    sources << [{ 'name' => 'kaiju' }, 'lib/kaiju/Placeholder.json']
    sources << [{ 'name' => 'kaiju' }, 'lib/kaiju/Workspace.json']
    sources.each { |e| e[1] = JSON.parse(File.read(e[1])) }
    ComponentInformation.instance_variable_set(
      :@cached_components, 'blarg' => IceNine.deep_freeze(Hash[ComponentInformation.gather_components(sources)])
    )
  end
end
