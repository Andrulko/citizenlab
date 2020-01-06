class WebApi::V1::ModerationSerializer < WebApi::V1::BaseSerializer
  set_type :moderation

  attributes :moderatable_type, :content_title_multiloc, :content_body_multiloc, :content_slug, :created_at

  attribute :belongs_to do |object|
    case object.moderatable_type
    when 'Idea'
      {project: {id: object.project_id, slug: object.project_slug, title_multiloc: object.project_title_multiloc}}
    when 'Initiative'
      {}
    when 'Comment'
      case object.post_type
      when 'Idea'
        {project: {id: object.project_id, slug: object.project_slug, title_multiloc: object.project_title_multiloc}, object.post_type.underscore.to_sym => {id: object.post_id, slug: object.post_slug, title_multiloc: object.post_title_multiloc}}
      when 'Initiative'
        {object.post_type.underscore.to_sym => {id: object.post_id, slug: object.post_slug, title_multiloc: pobject.ost_title_multiloc}}
      end
    end
  end

  attribute :moderation_status do |object|
    ModerationStatus.where(moderatable_id: object.id, moderatable_type: object.moderatable_type).first&.status || 'unread'
  end
end