class ActivitiesService

  def create_periodic_activities_for_current_tenant now: Time.now, since: 1.hour
    now = now.in_time_zone(Tenant.settings('core', 'timezone'))
    last_time = now - since

    create_phase_started_activities now, last_time 
    create_phase_upcoming_activities now, last_time
    create_invite_not_accepted_since_3_days_activities now, last_time
  end


  private

  def create_phase_started_activities now, last_time
    if now.to_date != last_time.to_date
      Phase.where(start_at: now.to_date).each do |phase|
        LogActivityJob.perform_later(phase, 'started', nil, phase.start_at.to_time.to_i)
      end
    end
  end

  def create_phase_upcoming_activities now, last_time
    if now.to_date != last_time.to_date
      Phase.where(start_at: now.to_date + 1.week).each do |phase|
        LogActivityJob.perform_later(phase, 'upcoming', nil, now.to_i)
      end
    end
  end

  def create_invite_not_accepted_since_3_days_activities now, last_time
    Invite.where('accepted_at IS NULL')
      .where(created_at: (last_time - 3.days)..(now - 3.days)).each do |invite|
      LogActivityJob.perform_later(invite, 'not_accepted_since_3_days', nil, now.to_i)
    end
  end

end