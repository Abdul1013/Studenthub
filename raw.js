 // // const saveFlashcards = async () => {
  //   if (!name) {
  //     alert("Please enter a name for your deck");
  //     return;
  //   }

  //   if (!user || !user.uid) {
  //     alert("User is not authenticated. Please sign in.");
  //     return;
  //   }

  //   setSaving(true);
  //   const batch = writeBatch(db);
  //   const userDocRef = doc(db, "users", user.uid);
  //   const docSnap = await getDoc(userDocRef);

  //   let existingDecks = [];

  //   if (docSnap.exists()) {
  //     existingDecks = docSnap.data().flashcards || [];
  //     if (existingDecks.find((deck) => deck.name === name)) {
  //       alert("A deck with this name already exists");
  //       setSaving(false);
  //       return;
  //     }
  //   }

  //   // Add the new deck to the user's collection
  //   existingDecks.push({ name });
  //   batch.set(userDocRef, { flashcards: existingDecks }, { merge: true });

  //   // Set flashcards in a subcollection for the deck
  //   const colRef = collection(
  //     db,
  //     "users",
  //     user.uid,
  //     "flashcards",
  //     name,
  //     "cards"
  //   );

  //   flashcards.forEach((flashcard) => {
  //     const cardDocRef = doc(colRef, flashcard.id);
  //     batch.set(cardDocRef, flashcard);
  //   });

  //   try {
  //     await batch.commit();
  //     handleClose();
  //     router.push("/flashcards");
  //   } catch (error) {
  //     console.error("Error saving flashcards", error);
  //   } finally {
  //     setSaving(false);
  //   }

  //   // const response = await fetch('/api/save', {
  // };

  // const saveFlashcards = async () => {
  //   if (!name) {
  //     alert("Please enter a name for your flashcard set.");
  //     return;
  //   }

  //   try {
  //     const userDocRef = doc(db, "users", user.uid);
  //     const userDocSnap = await getDoc(userDocRef);

  //     const batch = writeBatch(db);

  //     if (userDocSnap.exists()) {
  //       const userData = userDocSnap.data();
  //       const updatedSets = [...(userData.flashcardSets || []), { name }];
  //       batch.update(userDocRef, { flashcardSets: updatedSets });
  //     } else {
  //       batch.set(userDocRef, { flashcardSets: [{ name }] });
  //     }

  //     // The key part is ensuring the path to the document isn't empty
  //     const setDocRef = doc(collection(userDocRef, "flashcardSets"), name);
  //     flashcards.forEach((flashcard) => {
  //       const cardDocRef = doc(collection(setDocRef, "cards"), flashcard.id);
  //       batch.set(cardDocRef, flashcard);
  //     });

  //     await batch.commit();

  //     alert("Flashcards saved successfully!");
  //     handleCloseDialog();
  //     setName("");
  //     router.push("/flashcards");
  //   } catch (error) {
  //     console.error("Error saving flashcards:", error);
  //     alert("An error occurred while saving flashcards. Please try again.");
  //   }
  // };

  // const saveFlashcards = async () => {
  //   if (!name || name.trim() === "") {
  //     alert("Please enter a valid name for your flashcard set.");
  //     return;
  //   }

  //   if (!user || !user.uid) {
  //     alert("User is not authenticated. Please sign in.");
  //     return;
  //   }

  //   if (!flashcards || !Array.isArray(flashcards) || flashcards.length === 0) {
  //     alert("No flashcards to save. Please add flashcards before saving.");
  //     return;
  //   }

  //   setSaving(true);

  //   try {
  //     const batch = writeBatch(db);
  //     const userDocRef = doc(db, "users", user.uid);
  //     const userDocSnap = await getDoc(userDocRef);

  //     // Prepare the flashcard set data
  //     const flashcardSetData = {
  //       name: name.trim(),
  //       createdAt: new Date(),
  //     };

  //     // Update or create the user's flashcard sets list
  //     if (userDocSnap.exists()) {
  //       const userData = userDocSnap.data();
  //       const existingSets = userData.flashcards || [];

  //       // Check for duplicate set names
  //       if (existingSets.some((set) => set.name === name.trim())) {
  //         alert("A flashcard set with this name already exists.");
  //         setSaving(false);
  //         return;
  //       }

  //       const updatedSets = [...existingSets, flashcardSetData];
  //       batch.update(userDocRef, { flashcards: updatedSets });
  //     } else {
  //       batch.set(userDocRef, { flashcards: [flashcardSetData] });
  //     }

  //     // Create a subcollection for the flashcard set
  //     const setDocRef = doc(collection(userDocRef, "flashcards"), name.trim());
  //     batch.set(setDocRef, { name: name.trim(), createdAt: new Date() });

  //     batch.set(cardDocRef, {
  //       front: flashcardSetData.front,
  //       back: flashcards.back,
  //       createdAt: new Date(),
  //     });

  //     // Add each flashcard to the 'cards' subcollection within the flashcard set
  //     flashcards.forEach((flashcards, index) => {
  //       // Validate flashcard data
  //       if (!flashcards.question || !flashcards.answer) {
  //         console.warn(
  //           `Flashcard at index ${index} is missing 'question' or 'answer' fields.`
  //         );
  //         return; // Skip invalid flashcards
  //       }

  //       // Generate a unique ID for each flashcard
  //       const flashcardId = doc(collection(setDocRef, "cards")).id;
  //       const cardDocRef = doc(setDocRef, "cards", flashcardId);
  //     });

  //     await batch.commit();

  //     alert("Flashcards saved successfully!");
  //     handleClose();
  //     setName("");
  //     router.push("/flashcards");
  //   } catch (error) {
  //     console.error("Error saving flashcards:", error.message);
  //     console.error(error.stack);
  //     alert(`An error occurred while saving flashcards: ${error.message}`);
  //   } finally {
  //     setSaving(false);
  //   }
  // };