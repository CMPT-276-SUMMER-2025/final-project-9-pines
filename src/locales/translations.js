export const translations = {
  en: {
    // Header
    title: "GymWhisper",
    language: "Language",
    
    // Sidebar
    menu: "Menu",
    home: "Home",
    history: "History",
    closeMenu: "Close menu",
    
    // Main content
    recordButton: "Record",
    recording: "Recording...",
    stopRecording: "Stop Recording",
    yourWorkout: "Your Workout",
    noWorkoutData: "No workout data yet",
    recordExercises: "Record your exercises to see them here",
    
    // Toast messages
    addedToWorkout: "Added to your workout!",
    
    // Workout Panel
    workoutPanelTitle: "Your Workout",
    finalizeWorkout: "Finalize Workout",
    finalizeWorkoutTitle: "Finalize Workout",
    cancelFinalize: "Cancel finalize",
    closeWorkoutPanel: "Close workout panel",
    
    // Workout Table
    workoutType: "Workout Type",
    reps: "Reps",
    weight: "Weight",
    date: "Date",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    
    // Confirmation Dialog
    confirmFinalize: "Are you sure you want to export your workout? This action cannot be undone and your current workout will be erased.",
    confirm: "Confirm",
    cancelAction: "Cancel",
    
    // History Page
    workoutHistory: "Workout History",
    viewPastSessions: "View your past workout sessions and exercises.",
    noHistoryFound: "No workout history found.",
    completeWorkouts: "Complete and finalize workouts to see them here.",
    backToHome: "← Back to Home",
    summarizeWorkoutHistory: "Summarize Workout History",
    workoutSummary: "Workout Summary",
    close: "Close",
    
    // Empty states
    noDataFound: "No workout data found.",
    recordExercisesHome: "Record some exercises on the home page to see them here.",
    
    // Error messages
    browserNotSupported: "Your browser does not support speech recognition",
    microphonePermission: "Please give microphone permission",
    
    // Dark mode
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    
    // Language names
    english: "English",
    french: "French",
  },
  
  fr: {
    // Header
    title: "GymWhisper",
    language: "Langue",
    
    // Sidebar
    menu: "Menu",
    home: "Accueil",
    history: "Historique",
    closeMenu: "Fermer le menu",
    
    // Main content
    recordButton: "Enregistrer",
    recording: "Enregistrement...",
    stopRecording: "Arrêter l'enregistrement",
    yourWorkout: "Votre entraînement",
    noWorkoutData: "Aucune donnée d'entraînement pour le moment",
    recordExercises: "Enregistrez vos exercices pour les voir ici",
    
    // Toast messages
    addedToWorkout: "Ajouté à votre entraînement !",
    
    // Workout Panel
    workoutPanelTitle: "Votre entraînement",
    finalizeWorkout: "Finaliser l'entraînement",
    finalizeWorkoutTitle: "Finaliser l'entraînement",
    cancelFinalize: "Annuler la finalisation",
    closeWorkoutPanel: "Fermer le panneau d'entraînement",
    
    // Workout Table
    workoutType: "Type d'exercice",
    reps: "Répétitions",
    weight: "Poids",
    date: "Date",
    actions: "Actions",
    edit: "Modifier",
    delete: "Supprimer",
    save: "Enregistrer",
    cancel: "Annuler",
    
    // Confirmation Dialog
    confirmFinalize: "Êtes-vous sûr de vouloir exporter votre entraînement ? Cette action ne peut pas être annulée et votre entraînement actuel sera effacé.",
    confirm: "Confirmer",
    cancelAction: "Annuler",
    
    // History Page
    workoutHistory: "Historique d'entraînement",
    viewPastSessions: "Consultez vos sessions d'entraînement et exercices passés.",
    noHistoryFound: "Aucun historique d'entraînement trouvé.",
    completeWorkouts: "Terminez et finalisez des entraînements pour les voir ici.",
    backToHome: "← Retour à l'accueil",
    summarizeWorkoutHistory: "Résumer l'historique d'entraînement",
    workoutSummary: "Résumé d'entraînement",
    close: "Fermer",
    
    // Empty states
    noDataFound: "Aucune donnée d'entraînement trouvée.",
    recordExercisesHome: "Enregistrez quelques exercices sur la page d'accueil pour les voir ici.",
    
    // Error messages
    browserNotSupported: "Votre navigateur ne prend pas en charge la reconnaissance vocale",
    microphonePermission: "Veuillez autoriser l'accès au microphone",
    
    // Dark mode
    lightMode: "Mode clair",
    darkMode: "Mode sombre",
    
    // Language names
    english: "Anglais",
    french: "Français",
  }
};

export const getTranslation = (key, language = 'en') => {
  return translations[language]?.[key] || translations.en[key] || key;
}; 