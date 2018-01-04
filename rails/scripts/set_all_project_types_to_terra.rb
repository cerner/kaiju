ids = Kaiju::Project.ids
puts Kaiju::Project.redis.client.host
# puts ids
ids.each do |id|
  project = Kaiju::Project.by_id(id)
  # project.type = 'terra'
  puts("#{project.id}\n")
  puts("#{project.type.value}\n")
end

ids = Kaiju::Workspace.ids
puts Kaiju::Workspace.redis.client.host
# puts ids
ids.each do |id|
  workspace = Kaiju::Workspace.by_id(id)
  # workspace.project_type = 'terra'
  puts("#{workspace.id}\n")
  puts("#{workspace.project_type.value}\n")
end

ids = Kaiju::Component.ids
puts Kaiju::Component.redis.client.host
# puts ids
ids.each do |id|
  component = Kaiju::Component.by_id(id)
  # component.project_type = 'terra'
  puts("#{component.id}\n")
  puts("#{component.project_type.value}\n")
end
