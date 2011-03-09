Marblerun::Application.routes.draw do

  resources :tracks, :only => [:index, :create, :new, :show, :update] do 
    member do
      get 'previous', :action => 'previous'
      get 'next', :action => 'next'
      get 'previous/:sorting', :action => 'previous'
      get 'next/:sorting', :action => 'next'
    end

    collection do
      get 'info'
    end
  end

  resources :unlocks, :only => [:index]

  controller :pages do
    match 'about' => :about
    match 'imprint' => :imprint
    match 'contact' => :contact
    match 'help' => :help
    match 'manifest' => :manifest
  end

  root :to => 'tracks#new'
end
