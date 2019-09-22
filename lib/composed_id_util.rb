module ComposedIdUtil
  def self.included(base)
    base.send :include, InstanceMethods
    base.extend ClassMethods
  end

  module InstanceMethods
  end

  module ClassMethods
    def compose_id(id, prefix = '')
      prefix.blank? ? id : prefix + '::' + id.to_s
    end

    def decompose_id(id)
      id.split('::')
    end

    def iterate_composed_id(id, object, &block)
      ids = decompose_id(id)

      iterate_composed_ids(ids, object, &block)
    end

    def iterate_composed_ids(ids, object, &block)
      id = ids.shift
      id = id.match?(/\A\d+\z/) ? id.to_i : id

      item = block_given? ? yield(ids, object, id) : object[id]

      ids.empty? ? item : iterate_composed_ids(ids, item, &block)
    end
  end
end
