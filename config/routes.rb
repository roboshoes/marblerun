Marblerun::Application.routes.draw do

  resources :tracks, :only => [:index, :create, :new, :show, :update] do 
    member do
      get 'previous/:sorting', :action => 'previous'
      get 'next/:sorting', :action => 'next'
    end
  end

  resources :unlocks, :only => [:index]

  controller :pages do
    match 'about' => :about
    match 'imprint' => :imprint
    match 'contact' => :contact
    match 'help' => :help
  end
end
