module EmailCampaigns
  class Campaign < ApplicationRecord

    belongs_to :author, class_name: 'User', optional: true

    def self.before_send action_symbol
      @before_send_hooks ||= []
      @before_send_hooks << action_symbol
    end

    def self.before_send_hooks
      @before_send_hooks || []
    end

    def self.after_send action_symbol
      @after_send_hooks ||= []
      @after_send_hooks << action_symbol
    end

    def self.after_send_hooks
      @after_send_hooks || []
    end

    def self.recipient_filter action_symbol
      @recipient_filters ||= []
      @recipient_filters << action_symbol
    end

    def self.recipient_filters
      @recipient_filters || []
    end

    def self.campaign_name
      self.name.split('::').last.underscore
    end

    def apply_recipient_filters activity: nil, time: nil
      self.class.recipient_filters.inject(User.all) do |users_scope, action_symbol|
        self.send(action_symbol, users_scope, {activity: activity, time: time})
      end
    end

    def run_before_send_hooks activity: nil, time: nil
      self.class.before_send_hooks.all? do |action_symbol|
        self.send(action_symbol, {activity: activity, time: time})
      end
    end

    def run_after_send_hooks command
      self.class.after_send_hooks.each do |action_symbol|
        self.send(action_symbol, command)
      end
    end

    protected

    def serialize_campaign item
      serializer = "#{self.class.name}Serializer".constantize
      ActiveModelSerializers::SerializableResource.new(item, {
        serializer: serializer,
        adapter: :json
      }).serializable_hash
    end
  end
end