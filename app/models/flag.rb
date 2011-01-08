class Flag < ActiveRecord::Base
  validates_uniqueness_of :hash
end
