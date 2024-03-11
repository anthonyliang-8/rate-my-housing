import React, { useState, useEffect } from "react";
import { useParams, Link} from "react-router-dom";
import { db } from "../Firebase";
import { doc, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import {
  Box,
  Image,
  Text,
  Container,
  Divider,
  Button,
} from "@chakra-ui/react";

function Reviews() {
  const { id } = useParams();
  const [reviewListings, setReviewListings] = useState(null);

  useEffect(() => {
    const getReviewDetails = async () => {
      try {
        const dormDocRef = doc(db, "dorms", id);
        const dormSnapshot = await getDoc(dormDocRef);
        if (dormSnapshot.exists()) {
          const dormData = dormSnapshot.data();
          const imageURL = await getImageURL(dormData.img_path);
          setReviewListings({ ...dormData, img_url: imageURL });
        } else {
          console.log("No such dorm exists!");
        }
      } catch (error) {
        console.error("Error fetching dorm details:", error);
      }
    };

    getReviewDetails();
  }, [id]);

  const getImageURL = async (imagePath) => {
    try {
      // convert storage path to a reference
      const storageRef = getStorage();
      const imageRef = ref(storageRef, imagePath);

      // create download URL for the image
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error("Error getting image URL:", error);
      return ""; // Return an empty string if there's an error
    }
  };

  if (!reviewListings) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Box
        maxW="lg"
        maxH={"lg"}
        border={"1px"}
        borderRadius={"8px"}
        borderColor={"lightgrey"}
        marginTop={"2em"}
        paddingTop={"1em"}
        paddingBottom={"1em"}
      >
        <Container display={"flex"} flexDir={"row"} alignItems={"center"}>
          <Image
            rounded="md"
            w={"150px"}
            h={"auto"}
            src={reviewListings.img_url}
          />
          <Container display={"flex"} flexDir={"column"}>
            <Text fontSize={"18px"} as={"b"}>
              {reviewListings.name}
            </Text>
            <Divider />
            <Text>{reviewListings.campus} Campus</Text>
            <Text>Price Range: ${reviewListings.price}</Text>
            <Text>Rating: {reviewListings.rating}</Text>
          </Container>

          <Button colorScheme="blue">
            <Link to={`/dorm/${id}/rate`}>Rate </Link>
          </Button>
        </Container>
      </Box>
    </Container>
  );
}

export default Reviews;
