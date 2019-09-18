module Kaiju
  # Public: A User model
  module BaseModel
    def self.included(base)
      base.send :include, InstanceMethods
      base.extend ClassMethods
    end

    module InstanceMethods
      def json_representation(options = {})
        keys = redis_objects.keys
        keys &= options.fetch(:only, []) if options.include?(:only)
        keys.each_with_object('id' => send('id')) do |key, objects|
          objects[key.to_s] = send(key).value unless options[:except]&.include? key
        end
      end

      def expire(seconds)
        redis_objects.each_key { |key| redis.expire(send(key).key, seconds) }
      end

      def persist
        redis_objects.each_key { |key| redis.persist(send(key).key) }
      end

      def ttl
        redis.ttl(creation_date_time.key)
      end

      def inactive?
        inactive.value == true
      end

      def inactivate
        inactive.value = true
      end
    end

    module ClassMethods
      def ids
        redis.keys(redis_field_key(:creation_date_time, '*')).map do |key|
          key[(key.index(':') + 1)..-1].chomp(':creation_date_time')
        end
      end

      def valid_object(id)
        object = by_id(id.value)
        if object.nil?
          id.value = nil
        elsif block_given?
          object = yield(object)
        end
        object
      end

      def valid_objects(ids)
        ids.value.each_with_object([]) do |id, objects|
          object = by_id(id)
          if object.nil?
            ids.delete(id)
          else
            object = yield(object) if block_given?
            objects << object unless object.nil?
          end
        end
      end

      def exists?(id)
        id ? redis.exists(redis_field_key(:creation_date_time, id)) : false
      end

      def inactive?(id)
        new(id).inactive?
      end

      def by_id(id)
        new(id) if exists?(id)
      end
    end
  end
end
