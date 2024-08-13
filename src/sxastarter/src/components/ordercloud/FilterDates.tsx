/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, HStack, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import Cookies from 'universal-cookie';
import 'react-datepicker/dist/react-datepicker.css';
// CSS Modules, react-datepicker-cssmodules.css//
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import { updateTravelEndDate, updateTravelStartDate } from 'src/redux/ocUser';
import { useOcDispatch } from 'src/redux/ocStore';

export const Default = (): JSX.Element => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const dispatch = useOcDispatch();

  useEffect(() => {
    const cookies = new Cookies();
    updateStartDate(cookies.get('travelstartdate'));
    updateEndDate(cookies.get('travelenddate'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit() {
    updateStartDate(startDate);
    updateEndDate(endDate);
  }

  function updateStartDate(start: string | Date) {
    const cookies = new Cookies();
    if (start) {
      // update cookies
      cookies.set('travelstartdate', start, {
        path: '/',
      });

      // update redux
      if (typeof start !== 'string') {
        dispatch(updateTravelStartDate(start.toISOString()));
      } else {
        dispatch(updateTravelStartDate(start));
      }

      // update local state
      if (typeof start !== 'string') {
        setStartDate(start);
      } else {
        setStartDate(new Date(start));
      }
    }
  }

  function updateEndDate(end: string | Date) {
    const cookies = new Cookies();
    if (end) {
      // update cookies
      cookies.set('travelenddate', end, {
        path: '/',
      });

      // update redux
      if (typeof end !== 'string') {
        dispatch(updateTravelEndDate(end.toISOString()));
      } else {
        dispatch(updateTravelEndDate(end));
      }

      // update local state
      if (typeof end !== 'string') {
        setEndDate(end);
      } else {
        setEndDate(new Date(end));
      }
    }
  }

  return (
    <VStack w="100%" width="full" textAlign="center" alignItems="center" p={4}>
      <HStack
        w="100%"
        width="full"
        maxW="900px"
        textAlign="center"
        alignItems="center"
        border="1px"
        borderColor="gray.200"
        bgColor="gray.200"
        p={4}
        borderRadius="xl"
        verticalAlign="center"
      >
        <HStack w="300px" textAlign="right" alignItems="flex-start" pr={2}>
          <Text w="100%" width="full" lineHeight="44px" whiteSpace="nowrap">
            Arrival Date:
          </Text>
          <DatePicker
            selectsStart
            selected={startDate}
            onChange={(date: any) => setStartDate(date)}
            startDate={startDate}
          />
        </HStack>
        <HStack marginLeft={5} w="325px" textAlign="right" alignItems="flex-start">
          <Text w="100%" width="full" lineHeight="44px" whiteSpace="nowrap">
            Departure Date:
          </Text>
          <DatePicker
            selectsEnd
            selected={endDate}
            onChange={(date: Date) => setEndDate(date)}
            endDate={endDate}
            startDate={startDate}
            minDate={startDate}
          />
        </HStack>
        <VStack w="250px" textAlign="right">
          <Button maxW="200px" mt="0px" type="submit" onClick={onSubmit}>
            Save Trip Details
          </Button>
        </VStack>
      </HStack>
    </VStack>
  );
};
