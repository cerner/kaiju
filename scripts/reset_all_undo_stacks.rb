ids = Kaiju::Workspace.ids
puts Kaiju::Workspace.redis.client.host
# puts ids
ids.each do |id|
  workspace = Kaiju::Workspace.by_id(id)
  # workspace.stack_index.clear
  # workspace.changes_stack.clear
  puts("#{workspace.id}\n")
  puts("#{workspace.stack_index.value}\n")
  puts("#{workspace.changes_stack.value}\n")
end
