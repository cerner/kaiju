ids = Kaiju::Project.ids
puts Kaiju::Project.redis.client.host
# puts ids
ids.each do |id|
  project = Kaiju::Project.by_id(id)
  # project.type = terra
  puts("#{project.id}\n")
  puts("#{project.type.value}\n")
end
