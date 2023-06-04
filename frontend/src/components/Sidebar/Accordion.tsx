import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function Accordions() {
  const [expanded, setExpanded] = React.useState<string | false>('panel1');
  const [expanded2, setExpanded2] = React.useState<string | false>('panel2');

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
    const handleChange2 =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded2(newExpanded ? panel : false);
    };

  return (
    <div>

      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" sx={{backgroundColor: "#53c3ac"}}>
          <Typography>Channel</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            List
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded2 === 'panel2'} onChange={handleChange2('panel2')}>
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header" sx={{backgroundColor: "#53c3ac"}}>
          <Typography>DM</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            DM
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
