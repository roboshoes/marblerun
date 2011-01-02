class CreateMarbleRuns < ActiveRecord::Migration
  def self.up
    create_table :marble_runs do |t|
      t.float :total_length

      t.timestamps
    end
  end

  def self.down
    drop_table :marble_runs
  end
end
