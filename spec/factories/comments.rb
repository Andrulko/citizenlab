FactoryGirl.define do
  factory :comment do
    author
    idea
    parent nil
    body_multiloc {{
      "en" => "<p>I think this is a very good idea!</p>",
      "nl" => "<p>Geweldig idee!</p>"
    }}
  end

  factory :nested_comment do
    author
    idea
    parent :comment
    body_multiloc {{
      "en" => "<p>After some more thinking, there are some issues actually ...!</p>",
      "nl" => "<p>Na een nachtje slapen moet ik toegeven dat er toch nog wel problemen mee zijn</p>"
    }}
  end
end
