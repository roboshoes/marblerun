class Like < ActiveRecord::Base
  validates_uniqueness_of :hash
end
