module Kaiju
  class ModelJson
    class << self
      include Rails.application.routes.url_helpers
    end
    def self.klass
      nil
    end

    def self.to_json(id, base_url, options = {})
      JSON.pretty_generate(as_json(id, base_url, options))
    end

    def self.as_json(id, base_url, options = {})
      # model = klass.by_id(id)
      # inactive = options[:inactive] == true
      # return nil unless valid?(model, inactive)

      options[:lite] ? as_json_lite(id, base_url, options) : as_json_full(id, base_url, options)
    end

    def self.valid?(model, inactive)
      !model.nil? && (model.inactive? == inactive)
    end

    def self.map_id(id, inactive = false)
      valid?(klass.by_id(id), inactive) ? yield(id) : nil
    end

    def self.map_ids(ids, inactive = false, &block)
      ids.each_with_object([]) do |id, objects|
        object = map_id(id, inactive, &block)
        objects << object unless object.nil?
      end
    end

    def self.options_with_except(options, except)
      options.merge(except: options.fetch(:except, []).concat(except))
    end

    def self.as_json_full(_id, _base_url, _options = {})
      nil
    end

    def self.as_json_lite(id, base_url, options = {})
      as_json_full(id, base_url, options)
    end
  end
end
