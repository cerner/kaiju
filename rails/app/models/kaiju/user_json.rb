require 'kaiju/user'
require 'kaiju/project'
require 'kaiju/model_json'

module Kaiju
  class UserJson < ModelJson
    def self.klass
      User
    end

    def self.users_as_json(base_url, options = {})
      map_ids(User.ids) { |id| as_json(id, base_url, options.merge(lite: true)) }
    end

    def self.users_to_json(base_url, options = {})
      JSON.pretty_generate(users_as_json(base_url, options))
    end

    def self.as_json_full(id, base_url, options = {})
      hash = User.by_id(id).as_json(options_with_except(options, %i[inactive nickname]))
      hash['recent_workspaces'] = map_recent_workspaces(hash['recent_workspaces'], base_url)
      decorate_projects(hash, base_url)
      decorate_urls(hash, id, base_url)
      hash
    end

    def self.as_json_lite(id, base_url, _options = {})
      user = User.by_id(id)
      {
        'id' => user.id,
        'url' => base_url + user_path(user.id),
        'name' => user.name.value,
        'changelog_viewed' => user.changelog_viewed.value == true
      }
    end

    def self.decorate_projects(hash, base_url)
      hash['inactive_projects'] = ProjectJson.map_ids(hash['projects'], true) do |project_id|
        ProjectJson.as_json(project_id, base_url, lite: true)
      end
      projects = ProjectJson.map_ids(hash['projects']) do |project_id|
        ProjectJson.as_json(project_id, base_url, lite: true)
      end
      hash['projects'] = projects.sort_by { |project| project['name'].downcase }
      hash['shared_projects'] = ProjectJson.map_ids(hash['shared_projects']) do |project_id|
        ProjectJson.as_json(project_id, base_url, lite: true)
      end
    end

    def self.decorate_urls(hash, id, base_url)
      hash['url'] = base_url + user_path(id)
      hash['projects_url'] = base_url + user_projects_path(id)
    end

    def self.map_recent_workspaces(array, base_url)
      array.each_with_object([]) do |hash, objects|
        recent_hash =  {
          'project' => ProjectJson.map_id(hash['project']) { |id| ProjectJson.as_json(id, base_url, lite: true) },
          'workspace' => WorkspaceJson.map_id(hash['workspace']) do |id|
            WorkspaceJson.as_json(id, base_url, project_id: hash['project'], lite: true)
          end
        }
        next if recent_hash['project'].nil? || recent_hash['workspace'].nil?
        objects << recent_hash
      end
    end
  end
end
